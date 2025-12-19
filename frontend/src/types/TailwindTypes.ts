import { colorPropDef } from '@radix-ui/themes/props';

export type Color = (typeof colorPropDef.color.values)[number];

export type Size = 'small' | 'medium' | 'large';
