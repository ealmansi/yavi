package de.mpg.mpi.inf.d5.wiki.spark

import collection.mutable.MutableList

import org.joda.time.DateTime
import org.joda.time.Days

/**
 * JobUtility
 */
object JobUtility {
  /**
   *
   */
  def getJobName(jobObject: Object): String = {
    jobObject.getClass.getName.replaceAll("\\$", "")
  }

  /**
   *
   */
  val DayZero = new DateTime(2000, 1, 1, 0, 0, 0).toLocalDate
  val DaysPerWeek = 7

  /**
   *
   */
  def getDayNumber(timestamp: String): Int = {
    val timestampDateTime = new DateTime(timestamp).toLocalDate
    Days.daysBetween(DayZero, timestampDateTime).getDays
  }

  /**
   *
   */
  def getWeekCode(timestamp: String): Int = {
    val timestampDateTime = new DateTime(timestamp).toLocalDate
    Days.daysBetween(DayZero, timestampDateTime).getDays / DaysPerWeek
  }

  /**
   *
   */
  def isWithinPeriod(weekCode: Long,
                      periodStartWeekCode: Int,
                      periodEndWeekCode: Int): Boolean = {
    periodStartWeekCode <= weekCode && weekCode <= periodEndWeekCode
  }

  /**
   *
   */
  def percentageIncrease(revisionSize: Long, parentSize: Long): Double = {
    val numerator = revisionSize - parentSize
    val denominator = if (parentSize > 0) parentSize else 1
    numerator.toDouble / denominator.toDouble
  }

  /**
   *
   */
  def normalizeWikilink(wikilink: String): String = {
    var normalized = wikilink.trim()
    normalized = normalized.replaceAll("_+", " ")
    normalized = normalized.replaceAll(" +", " ")
    normalized = normalized.replaceAll("^:+", "")
    if (normalized.indexOf('#') > -1) {
      normalized = normalized.substring(0, normalized.indexOf('#'))
    }
    if (normalized.indexOf('|') > -1) {
      normalized = normalized.substring(0, normalized.indexOf('|'))
    }
    normalized.trim()
  }

  /**
   *
   */
  def setDifference(a: Seq[Long], b: Seq[Long]): Seq[Option[Long]] = {
    a.toSet.diff(b.toSet).toSeq.map(l => Some(l))
  }

  /**
   *
   */
  def makeDayPairs(days: Seq[Integer]): Seq[Seq[Option[Integer]]] = {
    val pairs = new Array[Seq[Option[Integer]]](days.length)
    val sortedDays = days.sorted
    if (!sortedDays.isEmpty) {
      pairs.update(0, Seq[Option[Integer]](Some(sortedDays(0)), None))
      for (i <- 1 to sortedDays.size - 1) {
        pairs.update(i, Seq[Option[Integer]](Some(sortedDays(i)), Some(sortedDays(i - 1))))
      }
    }
    pairs
  }

  /**
   *
   */
   def emptyArrayLong(): Seq[Option[Long]] = {
    new Array[Option[Long]](0)
  }
}
