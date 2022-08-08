export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  private updateNormal(item: Item, multiplier: number = 1) {
    let quality = DEGRADE_VALUE * multiplier;

    if (item.sellIn < SELL_DUE_DATE) {
      quality = DEGRADE_VALUE * 2 * multiplier;
    }

    if (item.quality - quality < MIN_QUALITY) {
      quality = MIN_QUALITY;
    }

    item.quality -= quality;

    if (item.quality > MAX_QUALITY) {
      item.quality = MAX_QUALITY;
    }
  }

  private updateBackstagePass(item: Item) {
    if (item.sellIn < SELL_DUE_DATE) {
      item.quality = MIN_QUALITY;
      return;
    }

    this.updateNormal(item, -1);

    if (item.sellIn < 10) {
      this.updateNormal(item, -1);
    }

    if (item.sellIn < 5) {
      this.updateNormal(item, -1);
    }
  }

  private updateAgedBrie(item: Item) {
    this.updateNormal(item, -1);
  }

  private updateConjured(item: Item) {
    this.updateNormal(item, 2);
  }

  updateQuality() {
    this.items.forEach((item) => {
      item.sellIn -= 1;

      switch (item.name) {
        case AGED_BRIE:
          this.updateAgedBrie(item);
          break;

        case BACKSTAGE_PASS:
          this.updateBackstagePass(item);
          break;

        case CONJURED:
          this.updateConjured(item);
          break;

        case SULFURAS:
          break;

        default:
          this.updateNormal(item);
          break;
      }
    });

    return this.items;
  }
}

const MAX_QUALITY = 50;
const MIN_QUALITY = 0;
const DEGRADE_VALUE = 1;
const SELL_DUE_DATE = 0;

const AGED_BRIE = "Aged Brie";
const BACKSTAGE_PASS = "Backstage passes to a TAFKAL80ETC concert";
const SULFURAS = "Sulfuras, Hand of Ragnaros";
const CONJURED = "Conjured Mana Cake";
