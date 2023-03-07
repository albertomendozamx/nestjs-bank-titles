import { promises as fsPromises } from 'fs';

import { Title } from 'src/dtos/title.dto';
export const save = async (
  titles: Title[],
  file = 'src/db/titles.json',
): Promise<boolean> => {
  try {
    await fsPromises.writeFile(file, JSON.stringify(titles, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};
