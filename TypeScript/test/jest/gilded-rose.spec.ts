import { GildedRose, Item } from "@/gilded-rose";

describe("Gilded Rose", () => {
  it("should have required properties for items", () => {
    const gildedRose = new GildedRose([
      new Item("+5 Dexterity Vest", 10, 20), //
      new Item("Aged Brie", 2, 0), //
      new Item("Elixir of the Mongoose", 5, 7), //
      new Item("Sulfuras, Hand of Ragnaros", 0, 80), //
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
      new Item("Conjured Mana Cake", 3, 6),
    ]);

    const items = gildedRose.updateQuality();

    for (const item of items) {
      expect(item.hasOwnProperty("name"));
      expect(item.hasOwnProperty("sellIn"));
      expect(item.hasOwnProperty("quality"));

      // Check for goblin to make sure noone changes the Item class
      expect(Object.keys(item).length).toBe(3);
    }
  });

  it("should degrade quality twice as fast when sellIn < 0", () => {
    const gildedRose = new GildedRose([
      new Item("+5 Dexterity Vest", 1, 20),
      new Item("Elixir of the Mongoose", 1, 7),
    ]);

    // more than or 0 days
    gildedRose.updateQuality();
    expect(gildedRose.items[0].sellIn).toBe(0);
    expect(gildedRose.items[1].sellIn).toBe(0);
    expect(gildedRose.items[0].quality).toBe(19);
    expect(gildedRose.items[1].quality).toBe(6);

    // less than 0 days
    gildedRose.updateQuality();
    expect(gildedRose.items[0].sellIn).toBe(-1);
    expect(gildedRose.items[1].sellIn).toBe(-1);
    expect(gildedRose.items[0].quality).toBe(17);
    expect(gildedRose.items[1].quality).toBe(4);
  });

  it("should never have negative quality", () => {
    const gildedRose = new GildedRose([
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
      new Item("Conjured Mana Cake", 3, 6),
    ]);

    for (let index = 0; index < 100; index++) {
      gildedRose.updateQuality();
    }

    for (const item of gildedRose.items) {
      expect(item.quality).toBeGreaterThanOrEqual(0);
    }
  });

  describe("Backstage passes 🎫", () => {
    it("should increase quality as sellIn decreases", () => {
      const gildedRose = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 11, 20),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(21);
    });

    it("should increase quality to maximum 50", () => {
      const gildedRose = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 11, 50),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(50);
    });

    it("should increase quality by 2 when there are 10 days or less", () => {
      const gildedRose = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(22);
    });

    it("should increase quality by 3 when there are 5 days or less", () => {
      const gildedRose = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(23);
    });

    it("should drop quality to 0 after the concert", () => {
      const gildedRose = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(0);
    });
  });

  describe("Aged Brie 🧀", () => {
    it("should increase quality the older it gets", () => {
      const gildedRose = new GildedRose([new Item("Aged Brie", 2, 0)]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(1);
    });

    it("should increase quality to maximum 50", () => {
      const gildedRose = new GildedRose([new Item("Aged Brie", 2, 0)]);

      for (let day = 0; day < 51; day++) {
        gildedRose.updateQuality();
      }

      const { 0: item } = gildedRose.items;

      expect(item.quality).toBe(50);
    });

    it("should increase quality twice as fast after sellIn < 0", () => {
      const gildedRose = new GildedRose([new Item("Aged Brie", 2, 0)]);

      // more than or 0 days
      expect(gildedRose.updateQuality()[0].quality).toBe(1);
      expect(gildedRose.updateQuality()[0].quality).toBe(2);

      // less than 0 days
      expect(gildedRose.updateQuality()[0].quality).toBe(4);
      expect(gildedRose.updateQuality()[0].quality).toBe(6);
    });
  });

  describe("Legendary Items 🦄", () => {
    it("should not decrease quality", () => {
      const gildedRose = new GildedRose([
        new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(80);
    });
  });

  describe("Conjured 👻", () => {
    it("should degrade twice as fast as normal items", () => {
      const gildedRose = new GildedRose([
        new Item("+5 Dexterity Vest", 10, 20),
        new Item("Elixir of the Mongoose", 5, 7),
        new Item("Conjured Mana Cake", 3, 6),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(19);
      expect(items[1].quality).toBe(6);
      expect(items[2].quality).toBe(4);
    });

    it("should degrade quality 4x as fast as normal items when sellIn < 0", () => {
      const gildedRose = new GildedRose([
        new Item("+5 Dexterity Vest", 0, 20),
        new Item("Elixir of the Mongoose", 0, 7),
        new Item("Conjured Mana Cake", 0, 6),
      ]);

      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(18);
      expect(items[1].quality).toBe(5);
      expect(items[2].quality).toBe(2);
    });
  });
});
