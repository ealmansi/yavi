package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfTotalOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageOutlinks

/**
 * BuildTableNumberOfTotalOutlinks
 */
object BuildTableNumberOfTotalOutlinks {
  def main(args: Array[String]): Unit = {
    // Read args.
    val wikiDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context, and run job.
    val jobName = JobUtility.getJobName(this)
    val jobContext = new JobContextParquet(jobName, wikiDirectory)
    jobContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)
    runJob(jobContext)
  }

  def runJob(jobContext: JobContext): Unit = {
    // Load dependencies.
    jobContext.loadTable(PageOutlinks)

    // Create table as select.
    jobContext.buildTable(NumberOfTotalOutlinks, s"""
      |SELECT
      |  $PageOutlinks.page_id AS page_id,
      |  $PageOutlinks.day_number AS day_number,
      |  COUNT(*) AS value
      |FROM $PageOutlinks
      |GROUP BY $PageOutlinks.page_id, $PageOutlinks.day_number
      |SORT BY page_id, day_number
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(NumberOfTotalOutlinks)
  }
}