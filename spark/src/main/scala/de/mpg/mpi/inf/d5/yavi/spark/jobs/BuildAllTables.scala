package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility

/**
 * BuildAllTables
 */
object BuildAllTables {
  def main(args: Array[String]): Unit = {
    // Read command line args.
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
    // Auxiliary tables.
    BuildTableTitleRedirection.runJob(jobContext)
    BuildTableTitleToPageId.runJob(jobContext)
    
    // Auxiliary tables.
    BuildTableRevertedRevisions.runJob(jobContext)
    BuildTableNonRevertedRevisions.runJob(jobContext)
    
    // Auxiliary tables.
    BuildTablePageDays.runJob(jobContext)
    BuildTablePreviousDay.runJob(jobContext)

    // Auxiliary tables.
    BuildTablePageOutlinks.runJob(jobContext)
    BuildTablePageInlinks.runJob(jobContext)
    
    // Daily added/removed outlinks.
    BuildTableAddedOutlinks.runJob(jobContext)
    BuildTableRemovedOutlinks.runJob(jobContext)

    // Daily added/removed inlinks.
    BuildTableAddedInlinks.runJob(jobContext)
    BuildTableRemovedInlinks.runJob(jobContext)
    
    // Daily signals.
    BuildTableNumberOfRevisions.runJob(jobContext)
    BuildTableNumberOfRevertedRevisions.runJob(jobContext)
    BuildTableNumberOfUniqueEditors.runJob(jobContext)
    BuildTablePageContentSize.runJob(jobContext)
    BuildTableNumberOfTotalOutlinks.runJob(jobContext)
    BuildTableNumberOfAddedOutlinks.runJob(jobContext)
    BuildTableNumberOfAddedInlinks.runJob(jobContext)
  }
}
