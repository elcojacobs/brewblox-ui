
import http, { intercept } from '@/helpers/http';
import notify from '@/helpers/notify';

import { asBlock, asDataBlock } from '../helpers';
import { Block, BlockIds } from '../types';
import { ApiSparkStatus, DataBlock, SparkExported, SparkStatus, UserUnits } from '../types';

export const fetchBlocks = (serviceId: string): Promise<Block[]> =>
  http.post<DataBlock[]>(`/${encodeURIComponent(serviceId)}/blocks/all/read`)
    .then(resp => resp.data.map((block: DataBlock) => asBlock(block, serviceId)))
    .catch(intercept(`Failed to fetch blocks from ${serviceId}`));

export const fetchBlock = ({ id, serviceId }: Block): Promise<Block> =>
  http.post<DataBlock>(`/${encodeURIComponent(serviceId)}/blocks/read`, { id })
    .then(resp => asBlock(resp.data, serviceId))
    .catch(intercept(`Failed to fetch ${id}`));

export const fetchStoredBlock = (serviceId: string, id: BlockIds): Promise<Block> =>
  http.post<DataBlock>(`/${encodeURIComponent(serviceId)}/blocks/read/stored`, { id })
    .then(resp => asBlock(resp.data, serviceId))
    .catch(intercept(`Failed to fetch stored block ${id}`));

export const createBlock = (block: Block): Promise<Block> =>
  http.post<DataBlock>(`/${encodeURIComponent(block.serviceId)}/blocks/create`, asDataBlock(block))
    .then(resp => asBlock(resp.data, block.serviceId))
    .catch(intercept(`Failed to create ${block.id}`));

export const persistBlock = (block: Block): Promise<Block> =>
  http.post<DataBlock>(`/${encodeURIComponent(block.serviceId)}/blocks/write`, asDataBlock(block))
    .then(resp => asBlock(resp.data, block.serviceId))
    .catch(intercept(`Failed to persist ${block.id}`));

export const renameBlock = (serviceId: string, existing: string, desired: string): Promise<any> =>
  http.post(`/${encodeURIComponent(serviceId)}/blocks/rename`, { existing, desired })
    .catch(intercept(`Failed to rename ${existing}`));

export const deleteBlock = ({ serviceId, id }: Block): Promise<string> =>
  http.post<BlockIds>(`/${encodeURIComponent(serviceId)}/blocks/delete`, { id })
    .then(resp => resp.data.id!)
    .catch(intercept(`Failed to delete ${id}`));

export const clearBlocks = (serviceId: string): Promise<any> =>
  http.post(`/${encodeURIComponent(serviceId)}/blocks/all/delete`)
    .catch(intercept(`Failed to clear blocks on ${serviceId}`));

export const cleanUnusedNames = (serviceId: string): Promise<string[]> =>
  http.post<BlockIds[]>(`/${encodeURIComponent(serviceId)}/blocks/cleanup`)
    .then(resp => resp.data.map(v => v.id!))
    .catch(intercept(`Failed to clean unused block names on ${serviceId}`));

export const fetchDiscoveredBlocks = (serviceId: string): Promise<Block[]> =>
  http.post<DataBlock[]>(`/${encodeURIComponent(serviceId)}/blocks/discover`)
    .then(resp => resp.data.map(v => asBlock(v, serviceId)))
    .catch(intercept(`Failed to discover objects on ${serviceId}`));

export const validateService = (serviceId: string): Promise<boolean> =>
  http.get<ApiSparkStatus>(`/${encodeURIComponent(serviceId)}/system/status`)
    .then(resp => resp.data.type === 'Spark')
    .catch(() => false);

export const fetchUnits = (serviceId: string): Promise<UserUnits> =>
  http.get<UserUnits>(`/${encodeURIComponent(serviceId)}/settings/units`)
    .then(resp => resp.data)
    .catch(intercept(`Failed to fetch unit settings on ${serviceId}`));

export const persistUnits = (serviceId: string, units: UserUnits): Promise<UserUnits> =>
  http.put<UserUnits>(`/${encodeURIComponent(serviceId)}/settings/units`, units)
    .then(resp => resp.data)
    .catch(intercept(`Failed to persist unit settings on ${serviceId}`));

export const persistAutoconnecting = (serviceId: string, enabled: boolean): Promise<boolean> =>
  http.put<{ enabled: boolean }>(`/${encodeURIComponent(serviceId)}/settings/autoconnecting`, { enabled })
    .then(resp => resp.data.enabled)
    .catch(intercept(`Failed to persist autoconnecting flag on ${serviceId}`));


const unknownStatus = (): ApiSparkStatus => ({
  type: 'Spark',
  autoconnecting: true,
  connect: false,
  handshake: false,
  synchronize: false,
  compatible: true, // no idea - assume yes
  latest: true, // no idea - assume yes
  valid: true, // no idea - assume yes
  info: [],
  address: null,
  connection: null,
});

export const fetchSparkStatus = async (serviceId: string): Promise<SparkStatus> => {
  try {
    const resp = await http.get<ApiSparkStatus>(`/${encodeURIComponent(serviceId)}/system/status`);
    return {
      ...resp.data,
      serviceId,
      available: true,
    };
  } catch (error) {
    notify.warn(`Unable to fetch Spark status: ${error}`, { shown: false });
    return {
      ...unknownStatus(),
      serviceId,
      available: false,
    };
  }
};

export const flashFirmware = (serviceId: string): Promise<any> =>
  http.post(`/${encodeURIComponent(serviceId)}/system/flash`, {})
    .then(resp => resp.data)
    .catch(intercept(`Failed to update firmware on ${serviceId}`));

export const serviceExport = (serviceId: string): Promise<SparkExported> =>
  http.post<SparkExported>(`/${encodeURIComponent(serviceId)}/blocks/backup/save`)
    .then(resp => resp.data)
    .catch(intercept(`Failed to fetch stored blocks from ${serviceId}`));

export const serviceImport = (serviceId: string, exported: SparkExported): Promise<string[]> =>
  http.post<{ messages: string[] }>(`/${encodeURIComponent(serviceId)}/blocks/backup/load`, exported)
    .then(resp => resp.data.messages)
    .catch(intercept(`Failed to reset stored blocks in ${serviceId}`));

export const reboot = (serviceId: string): Promise<any> =>
  http.post(`/${encodeURIComponent(serviceId)}/system/reboot`, {})
    .then(resp => resp.data)
    .catch(intercept(`Failed to reboot ${serviceId}`));
