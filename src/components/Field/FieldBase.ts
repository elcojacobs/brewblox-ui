import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class FieldBase extends Vue {

  @Prop({ type: String, default: 'span' })
  public readonly tag!: string;

  @Prop({ type: String, default: 'Edit value' })
  public readonly title!: string;

  @Prop({ type: String })
  public readonly message!: string;

  @Prop({ type: String })
  public readonly messageHtml!: string;

  @Prop({ type: Boolean, default: false })
  public readonly readonly!: boolean;

  @Prop({ type: Object, default: () => ({}) })
  public readonly dialogProps!: Mapped<any>;

  @Prop({ type: Object, default: () => ({}) })
  public readonly tagProps!: Mapped<any>;

  @Prop({ type: [Array, Object, String] })
  public readonly tagClass!: string[] | Mapped<string> | string;
}
