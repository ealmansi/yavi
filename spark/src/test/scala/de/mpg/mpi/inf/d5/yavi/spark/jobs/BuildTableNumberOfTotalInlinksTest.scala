package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfTotalInlinks

/**
 * BuildTableNumberOfTotalInlinksTest
 */
class BuildTableNumberOfTotalInlinksTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableNumberOfTotalInlinks.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(NumberOfTotalInlinks).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
