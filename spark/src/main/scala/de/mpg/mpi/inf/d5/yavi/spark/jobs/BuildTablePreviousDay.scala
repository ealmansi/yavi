package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageDays
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PreviousDay

/**
 * BuildTablePreviousDay
 */
object BuildTablePreviousDay {
  // Intermediate table.
  val PageDaysGrouped = "page_days_grouped"

  def main(args: Array[String]): Unit = {
    // Read args.
    val wikiDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context and create table.
    val jobName = JobUtility.getJobName(this)
    val jobContext = new JobContextParquet(jobName, wikiDirectory)
    jobContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)
    runJob(jobContext)
  }

  def runJob(jobContext: JobContext): Unit = {
    // Load dependencies.
    jobContext.loadTable(PageDays)

    // Register SQL UDFs.
    jobContext.udfRegistration.register("MAKE_DAY_PAIRS", JobUtility.makeDayPairs(_: Seq[Integer]))

    // Create intermediate table as select.
    jobContext.buildTable(PageDaysGrouped, s"""
      |SELECT
      |  $PageDays.page_id AS page_id,
      |  collect_set(CAST($PageDays.day_number AS int)) AS day_numbers
      |FROM $PageDays
      |GROUP BY $PageDays.page_id
      |SORT BY page_id
    """.stripMargin)

    // Create table as select.
    jobContext.buildTable(PreviousDay, s"""
      |SELECT
      |  $PageDaysGrouped.page_id AS page_id,
      |  day_pair[0] AS day_number,
      |  day_pair[1] AS previous_day
      |FROM $PageDaysGrouped
      |LATERAL VIEW explode(MAKE_DAY_PAIRS($PageDaysGrouped.day_numbers)) dp as day_pair
      |SORT BY page_id, day_number
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(PreviousDay)
  }
}
