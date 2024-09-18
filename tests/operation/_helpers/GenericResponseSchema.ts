export const GenericResponseSchema = {
  "GenericResponse": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "status": {
        "type": "integer",
        "format": "int32"
      },
      "message": {
        "type": "string"
      },
      "type": {
        "type": "string"
      }
    }
  }
}