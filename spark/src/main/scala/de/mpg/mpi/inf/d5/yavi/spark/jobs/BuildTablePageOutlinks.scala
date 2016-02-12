package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NonRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevisionWikilinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleRedirection
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleToPageId

/**
 * BuildTablePageOutlinks
 */
object BuildTablePageOutlinks {
  // Intermediate table.
  val PageWikilinks = "page_wikilinks"

  def main(args: Array[String]): Unit = {
    // Read args.
    val wikiDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"
    val akkaFrameSize = if (args(2).toInt > 0) args(2) else "10485760"

    // Initialize context and create table.
    val jobName = JobUtility.getJobName(this)
    val jobContext = new JobContextParquet(jobName, wikiDirectory)
    jobContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)
    jobContext.setConf("spark.akka.frameSize", akkaFrameSize)
    runJob(jobContext)
  }

  def runJob(jobContext: JobContext): Unit = {
    // Load dependencies.
    jobContext.loadTable(NonRevertedRevisions)
    jobContext.loadTable(RevisionWikilinks)
    jobContext.loadTable(TitleRedirection)
    jobContext.loadTable(TitleToPageId)

    // Register SQL UDFs.
    jobContext.udfRegistration.register("GET_DAY_NUMBER", JobUtility.getDayNumber(_: String))
    jobContext.udfRegistration.register("NORMALIZE_WIKILINK", JobUtility.normalizeWikilink(_: String))

    // Create intermediate table as select.
    jobContext.buildTable(PageWikilinks, s"""
      |SELECT DISTINCT
      |  $RevisionWikilinks.page_id AS page_id,
      |  GET_DAY_NUMBER($RevisionWikilinks.timestamp) AS day_number,
      |  LOWER(NORMALIZE_WIKILINK($RevisionWikilinks.wikilink)) AS normalized_wikilink
      |FROM $RevisionWikilinks
      |INNER JOIN $NonRevertedRevisions
      |ON $RevisionWikilinks.revision_id = $NonRevertedRevisions.revision_id
    """.stripMargin)

    // Create table as select.
    jobContext.buildTable(PageOutlinks, s"""
      |SELECT DISTINCT
      |  $PageWikilinks.page_id AS page_id,
      |  $PageWikilinks.day_number AS day_number,
      |  $TitleToPageId.page_id AS outlink
      |FROM $PageWikilinks
      |INNER JOIN $TitleRedirection
      |ON normalized_wikilink = LOWER($TitleRedirection.title)
      |INNER JOIN $TitleToPageId
      |ON $TitleRedirection.redirected_title = $TitleToPageId.title
      |SORT BY page_id, day_number, outlink
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(PageOutlinks)
  }
}
