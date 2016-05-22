package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode

/**
 * RedirectMap
 */
object RedirectMap {

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
    val pageMetadata = hiveContext.read
                        .format("com.databricks.spark.avro")
                        .load(s"$workDirectory/avro/page_metadata")
    pageMetadata.registerTempTable("page_metadata")

    // Build table.
    val redirectMap = hiveContext.sql(s"""
        select pm1.page_id as page_id, coalesce(pm3.page_id, pm2.page_id, pm1.page_id) as redirect
        from page_metadata pm1
        left join page_metadata pm2
        on pm1.redirect is not null and pm1.redirect like pm2.title
        left join page_metadata pm3
        on pm2.redirect is not null and pm2.redirect like pm3.title
    """)
    redirectMap.write
        .format("com.databricks.spark.avro")
        .save(s"$workDirectory/avro/redirect_map")
  }
}
