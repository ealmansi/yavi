package de.mpg.mpi.inf.d5.wiki.spark

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.SaveMode
import org.apache.spark.sql.hive.HiveContext

/**
 * JobContextParquet
 */
class JobContextParquet(appName: String, wikiDirectory: String) extends JobContext {
  /**
   *
   */
  val sparkConf = new SparkConf().setAppName(appName)
  val sparkContext = new SparkContext(sparkConf)
  val hiveContext = new HiveContext(sparkContext)

  /**
   *
   */
  def loadTable(tableId: String): Unit = {
    val tableDirectory = getTableDirectory(tableId)
    hiveContext
      .load(tableDirectory, "parquet")
      .registerTempTable(tableId)
  }

  /**
   *
   */
  def saveTable(tableId: String): Unit = {
    val tableDirectory = getTableDirectory(tableId)
    hiveContext
      .table(tableId)
      .save(tableDirectory, "parquet", SaveMode.Overwrite)
  }

  /**
   *
   */
  def getTableDirectory(tableId: String): String = {
    s"${wikiDirectory}/parquet/${tableId}"
  }
}
