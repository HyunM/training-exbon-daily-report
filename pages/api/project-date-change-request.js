const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const projectDateChangeRequestHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const query = `EXEC [Hammer].[dbo].[ProjectDateChangeRequest_Insert]
          ${body.EmployeeID}, ${body.ProjectID}, ${body.TaskID}, "${body.RequestType}", "${body.StartDate}", "${body.EndDate}"`;
          /* --Params--
          	@employeeID int,
            @projectID int,
            @taskID int,
            @requestType nvarchar(50),
            @startDate date,
            @endDate nchar(10) -- will be modified
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              message: "Success, the request has been submitted.",
            });
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default projectDateChangeRequestHandler;
