import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.SQLContext

def normalizeWikilink(wikilink: String): String = {
  var normalized = wikilink.trim()
  normalized = normalized.replaceAll("_+", " ")
  normalized = normalized.replaceAll(" +", " ")
  normalized = normalized.replaceAll("^:+", "")
  if (normalized.indexOf('#') > -1) {
    normalized = normalized.substring(0, normalized.indexOf('#'))
  }
  if (normalized.indexOf('|') > -1) {
    normalized = normalized.substring(0, normalized.indexOf('|'))
  }
  normalized.trim()
}

def registerUDFs(sqlContext: SQLContext): Unit = {
  sqlContext.udf.register("normalize_wikilink", normalizeWikilink(_: String))
}

def loadTable(tableId: String, workDirectory: String, sqlContext: SQLContext): DataFrame = {
  var table = sqlContext.read
    .format("com.databricks.spark.avro")
    .load(s"$workDirectory/avro/$tableId")
  table.registerTempTable(tableId)
  return table
}

def defineTable(tableId: String, sqlQuery: String, sqlContext: SQLContext): DataFrame = {
    val dataFrame = sqlContext.sql(sqlQuery)
    dataFrame.explain
    dataFrame.registerTempTable(tableId)
    return dataFrame
}

def saveTable(tableId: String, workDirectory: String, sqlContext: SQLContext): Unit = {
  sqlContext.table(tableId).write
    .format("com.databricks.spark.avro")
    .save(s"$workDirectory/avro/$tableId")
}
