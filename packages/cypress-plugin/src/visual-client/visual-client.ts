import axios, { AxiosInstance } from 'axios';
import { VisualPluginConfig } from '../plugin';
import { readFileSync } from 'fs';
export interface ScreenshotData {
  url: string;
}

export class VisualClient {
  private httpClient: AxiosInstance;
  constructor(private config: VisualPluginConfig) {
    this.httpClient = axios.create({
      baseURL: config.backendUrl,
      headers: {
        'x-visual-token': config.token,
      },
    });
  }

  public async uploadAndCheckScreenshot({
    screenshotName,
    imageFilePath,
  }: {
    screenshotName: string;
    imageFilePath: string;
  }) {
    //TODO: upload to s3 instead
    const formData = new FormData();
    formData.append('image', new Blob([readFileSync(imageFilePath)]), 's.xx');
    const { data } = await this.httpClient.post<ScreenshotData | null>(
      `/branch-screenshot`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          screenshotName,
          branchName: this.config.branch,
        },
      },
    );
    return data;
  }
}
