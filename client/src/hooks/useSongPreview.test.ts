import { describe, expect, it } from "vitest";
import { __songMatching } from "./useSongPreview";

const { isConfidentMatch, isOriginalRecording } = __songMatching;

const song = (title: string, artist: string) => ({ title, artist });

describe("hudobný kvíz — prijímame len originálnu nahrávku", () => {
  it("prijme presnú zhodu názvu aj interpreta", () => {
    expect(
      isConfidentMatch(
        song("Bohemian Rhapsody", "Queen"),
        "Bohemian Rhapsody",
        "Queen"
      )
    ).toBe(true);
  });

  it.each([
    ["Bohemian Rhapsody (Live at Wembley)", "Queen", "koncertná nahrávka"],
    ["Bohemian Rhapsody - Remix", "Queen", "remix"],
    ["Bohemian Rhapsody (Karaoke Version)", "Queen", "karaoke"],
    ["Bohemian Rhapsody - Instrumental", "Queen", "instrumentálka"],
    ["Bohemian Rhapsody (Acoustic)", "Queen", "akustická verzia"],
    ["Bohemian Rhapsody (Sped Up)", "Queen", "zrýchlená verzia"],
    ["Bohemian Rhapsody - Extended Mix", "Queen", "extended mix"],
    ["Bohemian Rhapsody (Medley)", "Queen", "medley"],
  ])("zamietne %s (%s)", (title, artist) => {
    expect(
      isOriginalRecording(song("Bohemian Rhapsody", "Queen"), title, artist)
    ).toBe(false);
    expect(
      isConfidentMatch(song("Bohemian Rhapsody", "Queen"), title, artist)
    ).toBe(false);
  });

  it("zamietne prevzatie od napodobňovateľa", () => {
    for (const artist of [
      "Queen Tribute Band",
      "The Karaoke Channel",
      "Made Famous By Queen",
      "Ameritz Tribute Standards",
    ]) {
      expect(
        isConfidentMatch(
          song("Bohemian Rhapsody", "Queen"),
          "Bohemian Rhapsody",
          artist
        )
      ).toBe(false);
    }
  });

  it("prijme remaster — je to tá istá nahrávka, len premasterovaná", () => {
    expect(
      isConfidentMatch(
        song("Africa", "Toto"),
        "Africa - Remastered 2020",
        "Toto"
      )
    ).toBe(true);
  });

  it("prijme radio edit — pri singloch je to bežne verzia originálu", () => {
    expect(
      isConfidentMatch(
        song("Blinding Lights", "The Weeknd"),
        "Blinding Lights - Radio Edit",
        "The Weeknd"
      )
    ).toBe(true);
  });
});

describe("značka verzie sa hľadá len v prívesku, nie v samotnom názve", () => {
  // Naivný filter na slovo „live" alebo „mix" by tieto skladby zamietol,
  // hoci to je ich skutočný názov.
  it.each([
    ["Live and Let Die", "Wings"],
    ["Live Forever", "Oasis"],
    ["Mixed Emotions", "The Rolling Stones"],
    ["Cover Me", "Bruce Springsteen"],
  ])("prijme %s od %s", (title, artist) => {
    expect(isOriginalRecording(song(title, artist), title, artist)).toBe(true);
    expect(isConfidentMatch(song(title, artist), title, artist)).toBe(true);
  });
});

describe("krátke mená interpretov sa nesmú trafiť do cudzieho mena", () => {
  it("zamietne cudzieho interpreta, ktorý obsahuje krátke meno ako slovo", () => {
    // „Toto" je slovom v „Totó la Momposina", ale je to iný interpret.
    expect(
      isConfidentMatch(
        song("Africa", "Toto"),
        "Africa Deluxe",
        "Totó la Momposina"
      )
    ).toBe(false);
    // „Ego" je slovom v „Ego Kill Talent".
    expect(
      isConfidentMatch(
        song("Malá nočná hudba", "Ego"),
        "Malá nočná",
        "Ego Kill Talent"
      )
    ).toBe(false);
  });

  it("presné meno krátkeho interpreta prijme normálne", () => {
    expect(isConfidentMatch(song("Africa", "Toto"), "Africa", "Toto")).toBe(
      true
    );
    expect(
      isConfidentMatch(song("Chandelier", "Sia"), "Chandelier", "Sia")
    ).toBe(true);
  });

  it("dlhé meno interpreta smie sedieť aj čiastočne", () => {
    // Poskytovatelia bežne pridávajú hosťujúcich interpretov do kreditu.
    expect(
      isConfidentMatch(
        song("Titanium", "David Guetta"),
        "Titanium",
        "David Guetta, Sia"
      )
    ).toBe(true);
  });
});

describe("nesprávny interpret sa nesmie prijať", () => {
  it("zamietne správny názov s úplne iným interpretom", () => {
    expect(
      isConfidentMatch(
        song("All the Small Things", "Fall Out Boy"),
        "All the Small Things",
        "blink-182"
      )
    ).toBe(false);
  });
});
