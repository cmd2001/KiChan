import { Context } from 'telegraf';
import { API, Image, TagTypes } from 'nhentai-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import telefile from 'telefile';
import createTelegraph from '../common/createTelegraph';
import getHentaiService from '../services/hentai.service';
import getMessageService from '../services/message.service';
import { Status } from '../common/status.enum';
import { HentaiType } from '../entities/hentai.entity';
import { OperationType } from '../entities/message.entity';

export default async function nhentai(ctx: Context) {
  const messageService = getMessageService();
  const message = await messageService.saveCommandByContext(ctx, OperationType.HENTAI);
  const hentaiService = getHentaiService();
  const hentai = await hentaiService.saveHentai({ messageId: message.id, type: HentaiType.NHENTAI, url: '', status: Status.ERROR });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sp = ctx.update.message.text.split(' ');
  if (sp.length === 1 || !sp[1].toLowerCase().includes('nhentai.net')) {
    ctx.reply('请输入nhentai链接');
    return;
  }
  const nhentaiId: number = sp[1].split('/').reduce((acc: number | undefined, curr: string) => {
    if (curr.trim() === '') return acc;
    if (!isNaN(Number(curr))) {
      acc = Number(curr);
    }
    return acc;
  }, undefined);
  if (!nhentaiId) {
    ctx.reply('请输入有效的nhentai链接');
    return;
  }
  await hentaiService.updateHentai({ id: hentai.id, url: sp[1], status: Status.ERROR });
  await ctx.reply(`正在获取图片列表...`);
  const api = new API();
  const book = await api.getBook(nhentaiId);
  const urls: string[] = [];
  book.pages.forEach((page: Image) => {
    urls.push(api.getImageURL(page));
  });
  await ctx.reply(`图片列表获取完成!`);

  const telegraphUrls = await urls.reduce(async (acc: Promise<string[]>, curr: string, index: number) => {
    const accRes = await acc;
    await ctx.reply(`正在上传${index + 1}/${urls.length} ...`);
    accRes.push(await telefile({ url: curr }));
    return accRes;
  }, Promise.resolve([] as string[]));
  await ctx.reply(`图片上传完成!`);

  await ctx.reply(`正在发布到Telegraph...`);
  const page = await createTelegraph(book.title.pretty, telegraphUrls, sp[1]);
  await ctx.reply(`成功发布到Telegraph\nUrl: ${page.url}`);
  await hentaiService.updateHentai({ id: hentai.id, url: sp[1], status: Status.SUCCESS });
}
