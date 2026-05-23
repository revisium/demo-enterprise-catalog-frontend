import { catalogSnapshot } from 'src/entities/catalog';

export class HomePageDataSource {
  getSnapshot() {
    return catalogSnapshot;
  }
}
