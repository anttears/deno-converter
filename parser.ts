import _ from "https://deno.land/x/lodash@4.17.19/lodash.js";
type ForeignObject = Record<string, unknown>;

type Mtg = {
  name: string;
  setSize: number;
  code: string;
  cards: MtgCard[];
  tokens: MtgToken[];
};

type MtgToken = {
  name: string;
  colorIdentity: string;
  colors: string[];
  power: MtgValue;
  toughness: MtgValue;
  types: string[];
  text: string | null;
  uuid: string;
};

type MtgCard = {
  name: string;
  colorIdentity: string;
  colors: string[];
  power: MtgValue;
  toughness: MtgValue;
  types: string[];
  text: string | null;
  uuid: string;
  subTypes: string[];
  convertedManaCost: number;
  manaCost: MtgCost;
  rarity: string;
  abilities: MtgAbilities;
  flavorText: string | null;
};

type MtgAbilities = string[] | null;
type MtgValue = string | number | null;
type MtgCost = (string | number | null)[]|null;

const convertToValue = (value: string): MtgValue => {
  const float = parseFloat(value);
  const int = parseInt(value, 10);
  const isNumericMana = !isNaN(float) && isFinite(float) && float === int;

  if (isNumericMana) {
    return int;
  } else if (typeof value === "string") {
    return value;
  }
  return null;
};

/**
 * Convert mana cost string to an array of values e.g. '{2}{R}' into [2, 'R'].
 */
const convertManaCost = (manaCost: string|undefined): MtgCost => {
    if (!manaCost) {
        return null;
    }
  const regexp = /{(.*?)}/g;
  const manaList = [...manaCost.matchAll(regexp)].map((match) =>
    convertToValue(match[1])
  );
  return manaList;
};

const convertAbilities = (text: string): MtgAbilities => {
  if (text) {
    return text.split("\n").map((line) => line);
  }
  return null;
};

const convertCards = (mtgCards: ForeignObject[]): MtgCard[] => {
  return mtgCards.map((mtgCard) => {
    return {
      name: mtgCard.name,
      types: mtgCard.types,
      subTypes: mtgCard.subtypes,
      convertedManaCost: mtgCard.convertedManaCost,
      manaCost: convertManaCost(mtgCard.manaCost as string),
      rarity: mtgCard.rarity,
      power: convertToValue(mtgCard.power as string),
      toughness: convertToValue(mtgCard.toughness as string),
      colors: mtgCard.colors,
      colorIdentity: mtgCard.colorIdentity,
      abilities: convertAbilities(mtgCard.text as string),
      flavorText: (mtgCard.flavorText as string | undefined) || null,
      uuid: mtgCard.uuid,
    } as MtgCard;
  });
};

const convertTokens = (mtgTokens: ForeignObject[]): MtgToken[] => {
  return mtgTokens.map((token) => {
    return {
      name: token.name,
      colorIdentity: token.colorIdentity,
      colors: token.colors,
      power: convertToValue(token.power as string),
      toughness: convertToValue(token.toughness as string),
      types: token.types,
      text: convertAbilities(token.text as string),
      uuid: token.uuid,
    } as MtgToken;
  });
};

const parser = (mtgJson: ForeignObject): Mtg => {
  // This is a big file, so cut it down to what we do know.
  return {
    name: String(mtgJson.name),
    setSize: Number(mtgJson.totalSetSize),
    code: String(mtgJson.code),
    cards: convertCards(mtgJson.cards as ForeignObject[]),
    tokens: convertTokens(mtgJson.tokens as ForeignObject[]),
  };
};

export default parser;
