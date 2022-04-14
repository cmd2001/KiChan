import { getManager } from 'typeorm';
import { Status } from '../common/status.enum';
import { Hentai, HentaiType } from '../entities/hentai.entity';

export class HentaiService {
  private readonly hentaiRepository = getManager().getRepository(Hentai);
  async saveHentai(params: { messageId: number; type: HentaiType; url: string; status: Status }): Promise<Hentai> {
    const hentai = this.hentaiRepository.create(params);
    return this.hentaiRepository.save(hentai);
  }
  async updateHentai(params: { id: number; url: string; status: Status }): Promise<Hentai> {
    const hentai = await this.hentaiRepository.findOneBy({ id: params.id });
    hentai.url = params.url;
    hentai.status = params.status;
    return this.hentaiRepository.save(hentai);
  }
}

let hentaiService: HentaiService;
export default function getHentaiService() {
  if (!hentaiService) {
    hentaiService = new HentaiService();
  }
  return hentaiService;
}
