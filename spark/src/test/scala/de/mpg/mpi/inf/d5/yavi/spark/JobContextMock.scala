package de.mpg.mpi.inf.d5.wiki.spark

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode

/**
 * JobContextMock
 */
object JobContextMock extends JobContext {
  /**
   *
   */
  val TestDataDirectory = "test-data/"
  val TestOutputDirectory = "test-generated-tables/"
  val MasterLocal = "local"

  /**
   *
   */
  val sparkConf = new SparkConf().setMaster(MasterLocal).setAppName(this.getClass.getName)
  val sparkContext = new SparkContext(sparkConf)
  val hiveContext = {
    val hiveContext = new HiveContext(sparkContext)
    hiveContext.setConf("spark.sql.shuffle.partitions", "1")
    hiveContext
  }

  /**
   *
   */
  def loadTable(tableId: String): Unit = {
    val tableFilePath = getTableFilePath(tableId)
    hiveContext
      .jsonFile(tableFilePath)
      .registerTempTable(tableId)
  }

  /**
   *
   */
  def saveTable(tableId: String): Unit = {
    val tableOutputDirectoryPath = getTableOutputDirectoryPath(tableId)
    getDataFrame(tableId).save(tableOutputDirectoryPath, "json", SaveMode.Overwrite)
  }

  /**
   *
   */
  def getDataFrame(tableId: String): DataFrame = {
    hiveContext.table(tableId)
  }

  /**
   *
   */
  def clear(): Unit = {
    hiveContext.tableNames().foreach(tableId => {
      hiveContext.sql(s"DROP TABLE IF EXISTS ${tableId}")
    })
  }

  /**
   *
   */
  def getTableFilePath(tableId: String): String = {
    this.getClass.getResource(s"/${TestDataDirectory}/${tableId}.json").toString
  }

  /**
   *
   */
  def getTableOutputDirectoryPath(tableId: String): String = {
    this.getClass.getResource("/").toString + s"/${TestOutputDirectory}/${tableId}"
  }
}
