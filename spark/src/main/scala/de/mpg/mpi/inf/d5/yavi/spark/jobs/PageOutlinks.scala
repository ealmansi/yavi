package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode

/**
 * PageOutlinks
 */
object PageOutlinks {

  /**
   * Job entry point.
   */
  def main(args: Array[String]): Unit = {
    
    // Read args.
    val workDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context.
    val jobName = JobUtility.getJobName(this)
    val sparkConf = new SparkConf().setAppName(jobName)
    val sparkContext = new SparkContext(sparkConf)
    val hiveContext = new HiveContext(sparkContext)

    // Configure job.
    hiveContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)

    // Load dependencies.

    val pageWikilinks = hiveContext.read
                        .format("com.databricks.spark.avro")
                        .load(s"$workDirectory/avro/page_wikilinks")
    pageWikilinks.registerTempTable("page_wikilinks")
    val pageMetadata = hiveContext.read
                        .format("com.databricks.spark.avro")
                        .load(s"$workDirectory/avro/page_metadata")
    pageMetadata.registerTempTable("page_metadata")
    val redirectMap = hiveContext.read
                        .format("com.databricks.spark.avro")
                        .load(s"$workDirectory/avro/redirect_map")
    redirectMap.registerTempTable("redirect_map")


    // Build table.
    val pageOutlinks = hiveContext.sql(s"""
        select pw.page_id, rm.redirect
        from page_wikilinks pw
        inner join page_metadata pm
        on lower(pw.wikilink) = lower(pm.title)
        inner join redirect_map rm
        on pm.page_id = rm.page_id
    """)
    pageOutlinks.write
        .format("com.databricks.spark.avro")
        .save(s"$workDirectory/avro/page_outlinks")
  }
}
