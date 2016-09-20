import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("daily_num_contributors", workDirectory, sqlContext)

  saveTableCsv("daily_num_contributors", workDirectory, sqlContext)

}
