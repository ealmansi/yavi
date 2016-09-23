import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_similarity", workDirectory, sqlContext)

  saveTableCsv("page_similarity", workDirectory, sqlContext)

}
