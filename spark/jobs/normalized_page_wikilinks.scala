import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  registerUDFs(sqlContext)

  loadTable("page_wikilinks", workDirectory, sqlContext)

  defineTable("normalized_page_wikilinks", s"""
        SELECT DISTINCT pw.page_id AS page_id, NORMALIZE_WIKILINK(pw.wikilink) AS wikilink
        FROM page_wikilinks pw
        WHERE NORMALIZE_WIKILINK(pw.wikilink) <> ''
  """, sqlContext)

  saveTable("normalized_page_wikilinks", workDirectory, sqlContext)

}
