import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/job_utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  registerUDFs(sqlContext)

  loadTable("revision_wikilinks", workDirectory, sqlContext)

  defineTable("page_wikilinks", s"""
        select distinct rw.page_id, normalize_wikilink(rw.wikilink) as wikilink
        from revision_wikilinks rw
        where normalize_wikilink(rw.wikilink) <> ''
  """, sqlContext)

  saveTable("page_wikilinks", workDirectory, sqlContext)

}
