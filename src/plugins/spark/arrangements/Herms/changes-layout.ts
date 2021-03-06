import { uid } from 'quasar';

import { BuilderLayout } from '@/plugins/builder/types';

import { HermsConfig } from './types';

export function defineLayouts(config: HermsConfig): BuilderLayout[] {
  return [
    {
      id: uid(),
      title: `${config.prefix} Kettles`,
      width: 28,
      height: 15,
      parts: [
        {
          id: uid(),
          rotate: 0,
          settings: { color: '#c48600' },
          flipped: false,
          type: 'Kettle',
          x: 20,
          y: 1,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { color: '#9c4b00' },
          flipped: false,
          type: 'Kettle',
          x: 12,
          y: 1,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { color: '#b50000' },
          flipped: false,
          type: 'Kettle',
          x: 4,
          y: 1,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'Coil',
          x: 5,
          y: 4,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {
            blockServiceId: config.serviceId,
            pwm: { serviceId: config.serviceId, blockId: config.names.bkPwm },
            sizeX: 4,
          },
          flipped: true,
          type: 'HeatingElement',
          x: 21,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {
            blockServiceId: config.serviceId,
            pwm: { serviceId: config.serviceId, blockId: config.names.hltPwm },
            sizeX: 4,
          },
          flipped: false,
          type: 'HeatingElement',
          x: 3,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'WhirlpoolInlet',
          x: 20,
          y: 2,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'WhirlpoolInlet',
          x: 4,
          y: 2,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { sizeX: 4 },
          flipped: true,
          type: 'FilterBottom',
          x: 12,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { setpoint: { serviceId: config.serviceId, blockId: config.names.mtSetpoint } },
          flipped: false,
          type: 'SetpointDisplay',
          x: 13,
          y: 3,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { setpoint: { serviceId: config.serviceId, blockId: config.names.bkSetpoint } },
          flipped: false,
          type: 'SetpointDisplay',
          x: 21,
          y: 3,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { setpoint: { serviceId: config.serviceId, blockId: config.names.hltSetpoint } },
          flipped: false,
          type: 'SetpointDisplay',
          x: 5,
          y: 3,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 19,
          y: 2,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 18,
          y: 2,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 18,
          y: 3,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 18,
          y: 4,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 18,
          y: 5,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'BridgeTube',
          x: 18,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 11,
          y: 2,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 10,
          y: 2,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 9,
          y: 2,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 11,
          y: 6,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 10,
          y: 6,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 9,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'DipTube',
          x: 12,
          y: 2,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'DipTube',
          x: 20,
          y: 6,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 17,
          y: 6,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 16,
          y: 6,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 19,
          y: 6,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 2,
          y: 2,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 2,
          y: 3,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 2,
          y: 4,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 2,
          y: 5,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: true,
          type: 'DipTube',
          x: 7,
          y: 6,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 8,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 17,
          y: 9,
        },
        {
          id: uid(),
          rotate: 270,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 18,
          y: 8,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 18,
          y: 7,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 17,
          y: 7,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 15,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 9,
          y: 9,
        },
        {
          id: uid(),
          rotate: 270,
          settings: { enabled: false },
          flipped: false,
          type: 'Pump',
          x: 17,
          y: 8,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 3,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 4,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 5,
          y: 9,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 2,
          y: 6,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 3,
          y: 2,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 13,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 11,
          y: 9,
        },
        {
          id: uid(),
          rotate: 90,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 13,
          y: 8,
        },
        {
          id: uid(),
          rotate: 90,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 11,
          y: 8,
        },
        {
          id: uid(),
          rotate: 90,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 9,
          y: 8,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 9,
          y: 7,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 12,
          y: 7,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 10,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 12,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 13,
          y: 7,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'BridgeTube',
          x: 11,
          y: 7,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 10,
          y: 7,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 2,
          y: 7,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 16,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 14,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 18,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 19,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'SystemIO',
          x: 20,
          y: 9,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 7,
          y: 9,
        },
        {
          id: uid(),
          rotate: 270,
          settings: { enabled: false },
          flipped: false,
          type: 'Pump',
          x: 7,
          y: 8,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 8,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 6,
          y: 9,
        },
        {
          id: uid(),
          rotate: 270,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 8,
          y: 7,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 7,
          y: 7,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 11,
          y: 4,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 11,
          y: 5,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'ElbowTube',
          x: 10,
          y: 5,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 10,
          y: 4,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'BridgeTube',
          x: 9,
          y: 4,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'BridgeTube',
          x: 9,
          y: 5,
        },
        {
          id: uid(),
          rotate: 180,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 8,
          y: 4,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 8,
          y: 5,
        },
        {
          id: uid(),
          rotate: 90,
          settings: {},
          flipped: false,
          type: 'StraightTube',
          x: 9,
          y: 3,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { pid: { serviceId: config.serviceId, blockId: config.names.mtPid } },
          flipped: false,
          type: 'PidDisplay',
          x: 11,
          y: 1,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { pid: { serviceId: config.serviceId, blockId: config.names.bkPid } },
          flipped: false,
          type: 'PidDisplay',
          x: 19,
          y: 1,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { pid: { serviceId: config.serviceId, blockId: config.names.hltPid } },
          flipped: false,
          type: 'PidDisplay',
          x: 3,
          y: 1,
        },
        {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          type: 'TeeTube',
          x: 2,
          y: 9,
        },
        {
          id: uid(),
          rotate: 180,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 1,
          y: 9,
        },
        {
          id: uid(),
          rotate: 270,
          settings: { closed: true },
          flipped: false,
          type: 'Valve',
          x: 2,
          y: 8,
        },
        {
          id: uid(),
          rotate: 0,
          settings: { pressure: 10, liquids: ['#4AA0EF'] },
          flipped: false,
          type: 'SystemIO',
          x: 0,
          y: 9,
        },
      ],
    },
  ];
}
