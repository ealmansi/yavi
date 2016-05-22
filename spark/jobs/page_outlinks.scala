import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/job_utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  registerUDFs(sqlContext)

  loadTable("page_wikilinks", workDirectory, sqlContext)
  loadTable("page_metadata", workDirectory, sqlContext)
  loadTable("redirect_map", workDirectory, sqlContext)

  defineTable("page_outlinks", s"""
        select pw.page_id, rm.redirect
        from page_wikilinks pw
        inner join page_metadata pm
        on lower(pw.wikilink) = lower(pm.title)
        inner join redirect_map rm
        on pm.page_id = rm.page_id
  """, sqlContext)

  saveTable("page_outlinks", workDirectory, sqlContext)

}
