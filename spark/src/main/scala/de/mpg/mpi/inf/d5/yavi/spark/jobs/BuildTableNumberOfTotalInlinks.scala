package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfTotalInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageInlinks

/**
 * BuildTableNumberOfTotalInlinks
 */
object BuildTableNumberOfTotalInlinks {
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
    jobContext.loadTable(PageInlinks)

    // Create table as select.
    jobContext.buildTable(NumberOfTotalInlinks, s"""
      |SELECT
      |  $PageInlinks.page_id AS page_id,
      |  $PageInlinks.day_number AS day_number,
      |  COUNT(*) AS value
      |FROM $PageInlinks
      |GROUP BY $PageInlinks.page_id, $PageInlinks.day_number
      |SORT BY page_id, day_number
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(NumberOfTotalInlinks)
  }
}
