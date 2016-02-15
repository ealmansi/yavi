package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PreviousDay
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedInlinks

/**
 * BuildTableRemovedInlinks
 */
object BuildTableRemovedInlinks {
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
    jobContext.loadTable(PreviousDay)

    // Create table as select.
    jobContext.buildTable(RemovedInlinks, s"""
      |SELECT
      |  PageInlinksA.page_id AS page_id,
      |  PageInlinksA.day_number AS day_number,
      |  PageInlinksA.inlink AS inlink
      |FROM $PageInlinks PageInlinksA
      |INNER JOIN $PreviousDay
      |ON
      |  PageInlinksA.inlink = $PreviousDay.page_id AND
      |  PageInlinksA.day_number = $PreviousDay.previous_day
      |LEFT JOIN $PageInlinks PageInlinksB
      |ON
      |  PageInlinksA.page_id = PageInlinksB.page_id AND
      |  $PreviousDay.day_number = PageInlinksB.day_number AND
      |  PageInlinksA.inlink = PageInlinksB.inlink
      |WHERE PageInlinksB.page_id IS NULL
      |SORT BY page_id, day_number, inlink
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(RemovedInlinks)
  }
}