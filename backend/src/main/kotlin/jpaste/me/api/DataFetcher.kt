package jpaste.me.api

import com.atilika.kuromoji.unidic.Tokenizer
import com.moji4j.MojiConverter
import com.netflix.graphql.dgs.*
import java.util.*

@DgsComponent
class QueryDataFetcher {

    val tokenizer = Tokenizer()
    val moji = MojiConverter()

    @DgsQuery
    fun kanji(@InputArgument literal: String?, @InputArgument ranking: Int?): Kanji? {
        return if (literal != null)
            kanjisByLiteral[literal]
        else if (ranking != null)
            sortedKanji[ranking]
        else
            throw Exception("Either literal or ranking arguments must be provided")
    }

    @DgsQuery
    fun kanjis(@InputArgument literals: List<String>?, @InputArgument limit: Int?): List<Kanji?> {
        return if (literals != null) {
            literals.map { kanjisByLiteral[it] }
        } else if (limit != null) {
            sortedKanji.subList(0, limit)
        } else {
            throw Exception("Either literals or limit arguments must be provided")
        }
    }

    @DgsQuery
    fun word(@InputArgument literal: String?, @InputArgument ranking: Int?): Word? {
        return if (literal != null)
            wordsByLiteral[literal]
        else if (ranking != null)
            sortedWords[ranking]
        else
            throw Exception("Either literal or ranking arguments must be provided")
    }

    @DgsQuery
    fun words(@InputArgument literals: List<String>?, @InputArgument limit: Int?): List<Word?> {
        return if (literals != null) {
            literals.map { wordsByLiteral[it] }
        } else if (limit != null) {
            sortedWords.subList(0, limit)
        } else {
            throw Exception("Either literals or limit arguments must be provided")
        }
    }

    @DgsQuery
    fun analysis(@InputArgument text: String): Analysis {
        val rawtokens = tokenizer.tokenize(text)
        val tokens = rawtokens.map(
            fun(token: com.atilika.kuromoji.unidic.Token): Token {
                val text = token.surface
                val lemma = token.lemma
                val reading = token.lemmaReadingForm
                val pronunciation = moji.convertRomajiToHiragana(moji.convertKanaToRomaji(token.pronunciation))
                var entry = wordsByLiteral[lemma]?.entries?.firstOrNull {
                    moji.convertKanaToRomaji(it.reading) == moji.convertKanaToRomaji(reading)
                }
                if (entry == null) {
                    entry =
                        wordsByLiteral[lemma]?.entries?.sortedBy { it.translationsNumber }?.reversed()?.firstOrNull()
                }
                return Token(text, pronunciation, entry)
            }
        )
        val words =
            tokens.map { it.entry?.literal }.distinct().mapNotNull { wordsByLiteral[it] }.sortedBy { it.frequency }
                .reversed()
        val kanjis = text.toCharArray().map { it.toString() }.filter {
            kanjisByLiteral.containsKey(it)
        }.distinct().mapNotNull { kanjisByLiteral[it] }.sortedBy { it.frequency }.reversed()
        return Analysis(tokens, kanjis, words)
    }

    @DgsQuery
    fun analyses(@InputArgument texts: List<String>): List<Analysis> {
        return texts.map { analysis(it) }
    }

}

@DgsComponent
class WordDataFetcher {

    @DgsData(parentType = "Word")
    fun characters(env: DgsDataFetchingEnvironment): List<Character> {
        val word: Word = env.getSource()
        return characters(word.literal)
    }

}

@DgsComponent
class TokenDataFetcher {

    @DgsData(parentType = "Token")
    fun characters(env: DgsDataFetchingEnvironment): List<Character> {
        val token: Token = env.getSource()
        return characters(token.text)
    }

}

fun characters(text: String): List<Character> {
    return text.toCharArray().map(fun(char: Char): Character {
        val str = char.toString()
        return kanjisByLiteral[str] ?: if (str.matches(Regex("[ぁ-んァ-ン]"))) {
            Kana(str)
        } else {
            Other(str)
        }
    })
}

@DgsComponent
class KanjiDataFetcher {

    @DgsData(parentType = "Kanji")
    fun wordsContaining(env: DgsDataFetchingEnvironment, @InputArgument limit: Int?): List<Word>? {
        val kanji = env.getSource<Kanji>()
        val words = wordsbyCharacter[kanji.literal] ?: return listOf()
        return if (limit == null || limit >= words.size) words else words.subList(0, limit)
    }

    @DgsData(parentType = "Kanji")
    fun reading_stats(env: DgsDataFetchingEnvironment): List<ReadingStat>? {
        val kanji = env.getSource<Kanji>()
        return readingsByLiteral[kanji.literal]?.sortedBy { it.count }?.reversed()
    }

    @DgsData(parentType = "Kanji")
    fun calligraphy_svg(env: DgsDataFetchingEnvironment): String? {
        val kanji = env.getSource<Kanji>()
        return Base64.getEncoder().encodeToString(calligraphyByLiteral[kanji.literal]?.toByteArray())
    }

    @DgsData(parentType = "Kanji")
    fun stroke_order_svg(env: DgsDataFetchingEnvironment): String? {
        val kanji = env.getSource<Kanji>()
        return Base64.getEncoder().encodeToString(strokeOrderByLiteral[kanji.literal]?.toByteArray())
    }

}

@DgsComponent
class KanaDataFetcher {

    @DgsData(parentType = "Kana")
    fun calligraphy_svg(env: DgsDataFetchingEnvironment): String? {
        val kana = env.getSource<Kana>()
        return Base64.getEncoder().encodeToString(calligraphyByLiteral[kana.literal]?.toByteArray())
    }

}

@DgsComponent
class EntryDataFetcher {

    @DgsData(parentType = "Entry")
    fun word(env: DgsDataFetchingEnvironment): Word? {
        val entry = env.getSource<Entry>()
        return wordsByLiteral[entry.literal]
    }

}




















