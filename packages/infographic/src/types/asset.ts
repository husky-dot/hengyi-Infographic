export type ImageAsset =
  | string
  | {
      resource: string;
      color?: string;
      clipContent?: boolean;
      preserveAspectRatio?: string;
    };
