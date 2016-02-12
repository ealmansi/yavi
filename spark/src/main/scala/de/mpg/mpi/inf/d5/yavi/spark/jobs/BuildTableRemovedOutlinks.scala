package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PreviousDay
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedOutlinks

/**
 * BuildTableRemovedOutlinks
 */
object BuildTableRemovedOutlinks {
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
    jobContext.loadTable(PreviousDay)

    // Create table as select.
    jobContext.buildTable(RemovedOutlinks, s"""
      |SELECT
      |  PageOutlinksA.page_id AS page_id,
      |  PageOutlinksA.day_number AS day_number,
      |  PageOutlinksA.outlink AS outlink
      |FROM $PageOutlinks PageOutlinksA
      |INNER JOIN $PreviousDay
      |ON
      |  PageOutlinksA.page_id = $PreviousDay.page_id AND
      |  PageOutlinksA.day_number = $PreviousDay.previous_day
      |LEFT JOIN $PageOutlinks PageOutlinksB
      |ON
      |  PageOutlinksA.page_id = PageOutlinksB.page_id AND
      |  $PreviousDay.day_number = PageOutlinksB.day_number AND
      |  PageOutlinksA.outlink = PageOutlinksB.outlink
      |WHERE PageOutlinksB.page_id IS NULL
      |SORT BY page_id, day_number, outlink
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(RemovedOutlinks)
  }
}
