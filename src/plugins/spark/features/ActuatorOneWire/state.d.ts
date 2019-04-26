import { Link } from '@/helpers/units';
import { ConstraintsObj } from '@/plugins/spark/components/Constraints/state';
import { Block } from '@/plugins/spark/state';

export interface ActuatorOneWireBlock extends Block {
  data: {
    hwDevice: Link;
    channel: number;
    state: number;
    invert: boolean;
    constrainedBy: ConstraintsObj;
  };
}
