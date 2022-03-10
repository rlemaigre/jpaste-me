package jpaste.me.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.util.*
import java.util.zip.GZIPInputStream

var mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

fun <T> read(filename: String, type: TypeReference<T>): T {
    return mapper.readValue(GZIPInputStream(QueryDataFetcher::class.java.getResourceAsStream("/data/$filename")), type)
}

var kanjisByLiteral = read("kanjis.json.gz", object : TypeReference<Map<String, Kanji>>() {})
var sortedKanji = kanjisByLiteral.values.sortedBy { it.frequency }.reversed()
var wordsByLiteral = read("words.json.gz", object : TypeReference<Map<String, Word>>() {})
var sortedWords = wordsByLiteral.values.sortedBy { it.frequency }.reversed()
var wordsbyCharacter = initWordsByCharacter()
var readingsByLiteral = read("readings.json.gz", object : TypeReference<Map<String, List<ReadingStat>>>() {})
var calligraphyByLiteral = read("calligraphy.json.gz", object : TypeReference<Map<String, String>>() {})
var strokeOrderByLiteral = read("stroke_order.json.gz", object : TypeReference<Map<String, String>>() {})

fun initWordsByCharacter(): Map<String, List<Word>> {
    val result = mutableMapOf<String, MutableList<Word>>()
    for (word in wordsByLiteral.values) {
        for (char in word.literal.toCharArray()) {
            val str = char.toString()
            val list = result.computeIfAbsent(str) { mutableListOf() }
            list.add(word)
        }
    }
    result.values.forEach {
        Collections.sort(it, compareBy(Word::frequency).reversed())
    }
    return result
}

data class Analysis(val tokens: List<Token>, val kanjis: List<Kanji>, val words: List<Word>)

abstract class Character {
    abstract val literal: String
}

data class Kanji(
    override val literal: String,
    val codepoint: String?,
    val frequency: Float?,
    val grade: String?,
    val jlpt: String?,
    val meanings: List<String>?,
    val radical: String?,
    val ranking: Int?,
    val readings: Readings?,
    val stroke_count: Int?
) : Character()

data class Kana(
    override val literal: String
) : Character()

data class Other(
    override val literal: String
) : Character()

data class Readings(val on: List<String>?, val kun: List<String>?)

data class Word(
    val literal: String,
    val entries: List<Entry>?,
    val frequency: Float?
)

data class Entry(
    val literal: String?,
    val reading: String?,
    val furigana: List<String>?,
    val senses: List<Sense>?,
    val translationsNumber: Int?
)

data class Sense(
    val pos: List<String>?,
    val translations: List<String>?,
    val examples: List<Example>?
)

data class Example(
    val en: String?,
    val jp: String?
)

data class Token(
    val text: String,
    val pronunciation: String?,
    val entry: Entry?
)

data class ReadingStat(
    val type: String,
    val romaji: String,
    val count: Float,
    val weighted: Float
)