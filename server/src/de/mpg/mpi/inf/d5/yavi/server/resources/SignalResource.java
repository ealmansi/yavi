package de.mpg.mpi.inf.d5.yavi.server.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.JSONP;

import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;
import de.mpg.mpi.inf.d5.yavi.server.util.DateValue;

@Path("/signal")
@Produces("application/x-javascript")
public class SignalResource {
  SignalProvider signalProvider = new SignalProvider();
  
  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public List<DateValue> doGet(@QueryParam("pageid") int pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo,
      @QueryParam("signaltype") String signalType) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    switch(signalType) {
    case "numberofrevisions":
      return signalProvider.getNumberOfRevisions(pageId, wikipediaId, dayFrom, dayTo);
    case "numberofrevertedrevisions":
      return signalProvider.getNumberOfRevertedRevisions(pageId, wikipediaId, dayFrom, dayTo);
    case "numberofuniqueeditors":
      return signalProvider.getNumberOfUniqueEditors(pageId, wikipediaId, dayFrom, dayTo);
    case "pagecontentsize":
      return signalProvider.getPageContentSize(pageId, wikipediaId, dayFrom, dayTo);
    case "numberoftotaloutlinks":
      return signalProvider.getNumberOfTotalOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    case "numberofaddedoutlinks":
      return signalProvider.getNumberOfAddedOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    case "numberofaddedinlinks":
      return signalProvider.getNumberOfAddedInlinks(pageId, wikipediaId, dayFrom, dayTo);
    default:
      throw new WebApplicationException(Response.Status.BAD_REQUEST);
    }
  }
}
