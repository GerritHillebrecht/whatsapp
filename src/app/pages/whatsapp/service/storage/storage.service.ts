import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { MessageImage } from '@whatsapp/interface/whatsapp.message.interface';
import { STORAGE_IMAGE_PATH } from '@whatsapp/tokens';

export enum ImageSizes {
  SMALL = '_300x300',
  LARGE = '_1200x1200',
  DEFAULT = '',
}

interface FileData {
  filename: string;
  size: ImageSizes;
  type: ImageTypes;
  uuid: string;
}

export enum ImageTypes {
  AVIF = 'avif',
  WEBP = 'webp',
  JPG = 'jpg',
}
export type ImageType = 'avif' | 'webp' | 'jpg';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage;
  storagePath = inject(STORAGE_IMAGE_PATH);

  constructor() {
    this.storage = getStorage();
  }

  async uploadImage(file: File, uuid: string): Promise<string> {
    const filepath = `${this.storagePath}/${uuid}/${file.name}`;
    const storageRef = ref(this.storage, filepath);
    const uploadTask = await uploadBytes(storageRef, file);
    const filename = file.name.split('.').slice(0, -1).join('.');
    return filename;
  }

  async getDownloadURL({
    filename = 'default',
    type = ImageTypes.JPG,
    size = ImageSizes.LARGE,
    uuid,
  }: FileData) {
    const filepath = `${this.storagePath}/${uuid}/${filename}${size}.${type}`;
    return await getDownloadURL(ref(this.storage, filepath))
      .then((result) => result)
      .catch((error) => '');
  }

  async getImages(filename: string, uuid: string): Promise<MessageImage[]> {
    const numberOfImageTypes = Object.keys(ImageTypes).length;
    const size = ImageSizes.SMALL;
    const promises = Promise.all([
      ...Array.from(
        { length: numberOfImageTypes - 1 },
        (_, index) => index
      ).map(async (index) => {
        const type = Object.values(ImageTypes)[index];
        return {
          filename: await this.getDownloadURL({
            filename,
            size,
            type,
            uuid,
          }),
          size,
          type,
        };
      }),
      {
        filename: await this.getDownloadURL({
          filename,
          size: ImageSizes.DEFAULT,
          type: ImageTypes.JPG,
          uuid,
        }),
        size: ImageSizes.DEFAULT,
        type: ImageTypes.JPG,
      },
    ]);

    return promises;
  }
}
