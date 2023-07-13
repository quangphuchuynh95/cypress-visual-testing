import { VisualPluginConfig } from '../plugin';
import { readFileSync } from 'fs';

export interface BranchScreenshot {
  diffStatus: 'ExactlyTheSame' | string;
  fileKey: string;
  diffFileKey?: string;
  diffPixels?: number;
  diffMessage: string;
}

export class VisualClient {
  constructor(private config: VisualPluginConfig) {
    // this.httpClient = axios.create({
    //   baseURL: config.backendUrl,
    //   headers: {
    //     'x-visual-token': config.token,
    //   },
    // });
  }

  public async uploadScreenshot({
    screenshotName,
    imageFilePath,
  }: {
    screenshotName: string;
    imageFilePath: string;
  }) {
    //TODO: upload to s3 instead
    const formData = new FormData();
    formData.append('image', new Blob([readFileSync(imageFilePath)]), 's.xx');
    const urlParams = new URLSearchParams({
      screenshotName,
      branchName: this.config.branch,
    });
    const response = await fetch(
      `${this.config.backendUrl}/api/branch-screenshot?${urlParams.toString()}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'x-visual-token': this.config.token,
        },
      },
    );
    return response.json() as Promise<BranchScreenshot>;
  }
}
