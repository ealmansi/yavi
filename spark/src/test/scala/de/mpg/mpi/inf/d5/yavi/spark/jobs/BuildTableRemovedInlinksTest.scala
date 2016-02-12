package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedInlinks

/**
 * BuildTableRemovedInlinksTest
 */
class BuildTableRemovedInlinksTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableRemovedInlinks.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(RemovedInlinks).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
