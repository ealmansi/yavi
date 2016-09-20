import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("normalized_page_wikilinks", workDirectory, sqlContext)
  loadTable("page_metadata", workDirectory, sqlContext)
  loadTable("redirect_map", workDirectory, sqlContext)

  defineTable("page_outlinks", s"""
        SELECT DISTINCT npw.page_id AS page_id, rm.redirect AS outlink
        FROM normalized_page_wikilinks npw
        INNER JOIN page_metadata pm
        ON LOWER(npw.wikilink) = LOWER(pm.title)
        INNER JOIN redirect_map rm
        ON pm.page_id = rm.page_id
  """, sqlContext)

  saveTable("page_outlinks", workDirectory, sqlContext)

}