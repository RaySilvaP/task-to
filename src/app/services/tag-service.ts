import { Injectable, signal } from '@angular/core';
import Tag from '../models/tag';
import { invoke } from '@tauri-apps/api/core';

@Injectable()
export class TagService {
  private readonly _tags = signal<Tag[]>([]);
  public readonly tags = this._tags.asReadonly();

  public async load(): Promise<void> {
    const tags = await invoke<Tag[]>('get_tags');
    this._tags.set(tags);
  }

  public async add(tag: Tag): Promise<number> {
    const tagId = await invoke<number>('add_tag', { tag });
    await this.load();
    return tagId;
  }

  public async edit(tag: Tag) {
    await invoke('edit_tag', { tagId: tag.id, tag });
    await this.load();
  }

  public async delete(tagId: number) {
    await invoke('delete_tag', { tagId });
    await this.load();
  }
}
