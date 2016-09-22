import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  registerUDFs(sqlContext)

  loadTable("page_metadata", workDirectory, sqlContext)
  loadTable("page_wikilinks", workDirectory, sqlContext)
  
  defineTable("redirect_map", s"""
      SELECT pm1.page_id AS page_id, COALESCE(pm2.page_id, pm1.page_id) AS redirect
      FROM page_metadata pm1
      LEFT JOIN page_metadata pm2
      ON pm1.page_id <> pm2.page_id AND pm1.redirect = pm2.title
  """, sqlContext)

  defineTable("normalized_page_wikilinks", s"""
        SELECT DISTINCT pw.page_id AS page_id, NORMALIZE_WIKILINK(pw.wikilink) AS wikilink
        FROM page_wikilinks pw
        WHERE NORMALIZE_WIKILINK(pw.wikilink) <> ''
  """, sqlContext)

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
