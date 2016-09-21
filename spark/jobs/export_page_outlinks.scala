import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_outlinks", workDirectory, sqlContext)

  saveTableCsv("page_outlinks", workDirectory, sqlContext)

}
