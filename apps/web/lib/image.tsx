export const getImageUrl = (imagePath: string) => {
    if(!imagePath){
      return '';
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${imagePath}`;
  };