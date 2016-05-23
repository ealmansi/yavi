import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_wikilinks", workDirectory, sqlContext)
  loadTable("page_metadata", workDirectory, sqlContext)
  loadTable("redirect_map", workDirectory, sqlContext)

  defineTable("page_outlinks", s"""
        SELECT DISTINCT pw.page_id AS page_id, rm.redirect AS outlink
        FROM page_wikilinks pw
        INNER JOIN page_metadata pm
        ON LOWER(pw.wikilink) = LOWER(pm.title)
        INNER JOIN redirect_map rm
        ON pm.page_id = rm.page_id
  """, sqlContext)

  saveTable("page_outlinks", workDirectory, sqlContext)

}
