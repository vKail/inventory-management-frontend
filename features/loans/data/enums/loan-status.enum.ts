/**
 * Enum simplificado que define los estados básicos de un préstamo
 * @enum {string}
 */
export enum LoanStatus {
  /** Estado cuando el préstamo está activo y el bien está en uso */
  ACTIVE = 'active',
  /** Estado cuando el bien ha sido devuelto */
  RETURNED = 'returned',
  /** Estado cuando el préstamo ha pasado su fecha de devolución */
  OVERDUE = 'overdue'
}
