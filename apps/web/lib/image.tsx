export const getImageUrl = (imagePath: string) => {
      if (!imagePath) {
          return '';
    }

      const normalized = imagePath.trim().replace(/\\/g, '/');

      if (/^https?:\/\//i.test(normalized)) {
          return normalized;
      }

      if (normalized.startsWith('/uploads/')) {
          return `${process.env.NEXT_PUBLIC_API_URL ?? ''}${normalized}`;
      }

      if (normalized.startsWith('uploads/')) {
          return `${process.env.NEXT_PUBLIC_API_URL ?? ''}/${normalized}`;
      }

      if (normalized.startsWith('images/') || normalized.startsWith('documents/')) {
          return `${process.env.NEXT_PUBLIC_API_URL ?? ''}/uploads/${normalized}`;
      }

      return `${process.env.NEXT_PUBLIC_API_URL ?? ''}/uploads/images/${normalized}`;
  };