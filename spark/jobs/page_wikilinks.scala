import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  registerUDFs(sqlContext)

  loadTable("revision_wikilinks", workDirectory, sqlContext)

  defineTable("page_wikilinks", s"""
        SELECT distinct rw.page_id AS page_id, NORMALIZE_WIKILINK(rw.wikilink) AS wikilink
        FROM revision_wikilinks rw
        WHERE NORMALIZE_WIKILINK(rw.wikilink) <> ''
  """, sqlContext)

  saveTable("page_wikilinks", workDirectory, sqlContext)

}
