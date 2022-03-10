export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

export type Query = {
    __typename?: "Query"
    kanji?: Maybe<Kanji>
    kanjis?: Maybe<Array<Maybe<Kanji>>>
    word?: Maybe<Word>
    words?: Maybe<Array<Maybe<Word>>>
    analysis?: Maybe<Analysis>
    analyses?: Maybe<Array<Maybe<Analysis>>>
}

export type QueryKanjiArgs = {
    literal?: Maybe<Scalars["String"]>
    ranking?: Maybe<Scalars["Int"]>
}

export type QueryKanjisArgs = {
    literals?: Maybe<Array<Maybe<Scalars["String"]>>>
    limit?: Maybe<Scalars["Int"]>
}

export type QueryWordArgs = {
    literal?: Maybe<Scalars["String"]>
    ranking?: Maybe<Scalars["Int"]>
}

export type QueryWordsArgs = {
    literals?: Maybe<Array<Maybe<Scalars["String"]>>>
    limit?: Maybe<Scalars["Int"]>
}

export type QueryAnalysisArgs = {
    text?: Maybe<Scalars["String"]>
}

export type QueryAnalysesArgs = {
    texts?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type Analysis = {
    __typename?: "Analysis"
    tokens?: Maybe<Array<Maybe<Token>>>
    kanjis?: Maybe<Array<Maybe<Kanji>>>
    words?: Maybe<Array<Maybe<Word>>>
}

export type Token = {
    __typename?: "Token"
    text?: Maybe<Scalars["String"]>
    pronunciation?: Maybe<Scalars["String"]>
    entry?: Maybe<Entry>
    characters?: Maybe<Array<Maybe<Character>>>
}

export type Character = {
    literal?: Maybe<Scalars["String"]>
}

export type Kanji = Character & {
    __typename?: "Kanji"
    literal?: Maybe<Scalars["String"]>
    codepoint?: Maybe<Scalars["String"]>
    frequency?: Maybe<Scalars["Float"]>
    grade?: Maybe<Scalars["String"]>
    jlpt?: Maybe<Scalars["String"]>
    meanings?: Maybe<Array<Maybe<Scalars["String"]>>>
    radical?: Maybe<Scalars["String"]>
    ranking?: Maybe<Scalars["Int"]>
    readings?: Maybe<Readings>
    reading_stats?: Maybe<Array<Maybe<ReadingStat>>>
    stroke_count?: Maybe<Scalars["String"]>
    calligraphy_svg?: Maybe<Scalars["String"]>
    stroke_order_svg?: Maybe<Scalars["String"]>
    wordsContaining?: Maybe<Array<Maybe<Word>>>
}

export type KanjiWordsContainingArgs = {
    limit?: Maybe<Scalars["Int"]>
}

export type Readings = {
    __typename?: "Readings"
    kun?: Maybe<Array<Maybe<Scalars["String"]>>>
    on?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type ReadingStat = {
    __typename?: "ReadingStat"
    type?: Maybe<ReadingType>
    romaji?: Maybe<Scalars["String"]>
    count?: Maybe<Scalars["Float"]>
    weighted?: Maybe<Scalars["Float"]>
}

export enum ReadingType {
    On = "on",
    Kun = "kun"
}

export type Kana = Character & {
    __typename?: "Kana"
    literal?: Maybe<Scalars["String"]>
    calligraphy_svg?: Maybe<Scalars["String"]>
}

export type Other = Character & {
    __typename?: "Other"
    literal?: Maybe<Scalars["String"]>
}

export type Word = {
    __typename?: "Word"
    literal: Scalars["String"]
    frequency?: Maybe<Scalars["Float"]>
    entries?: Maybe<Array<Maybe<Entry>>>
    characters?: Maybe<Array<Maybe<Character>>>
}

export type Entry = {
    __typename?: "Entry"
    reading?: Maybe<Scalars["String"]>
    furigana?: Maybe<Array<Maybe<Scalars["String"]>>>
    senses?: Maybe<Array<Maybe<Sense>>>
    translationsNumber?: Maybe<Scalars["Int"]>
    word?: Maybe<Word>
}

export type Sense = {
    __typename?: "Sense"
    examples?: Maybe<Array<Maybe<Example>>>
    pos?: Maybe<Array<Maybe<Scalars["String"]>>>
    translations?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type Example = {
    __typename?: "Example"
    en?: Maybe<Scalars["String"]>
    jp?: Maybe<Scalars["String"]>
}
