import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';


// Inicializa Oracle Client en modo Thick
oracledb.initOracleClient({ libDir: 'C:\\Users\\ne_cljar\\Downloads\\instantclient_12_2' }); // Cambia '/path/to/instantclient' por la ruta a tu Oracle Instant Client

@Injectable()
export class DocumentoService {
  constructor(private readonly dataSource: DataSource) {}

  async obtenerCodDocumMaestro(piCodDocumBanco: string): Promise<any> {

    console.log('piCodDocumBanco:', piCodDocumBanco);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();  // Conecta al queryRunner
      await queryRunner.startTransaction();  // Inicia la transacción

      const result = await queryRunner.query(
        `BEGIN
           mel_k_plic.obtenercoddocummaestro(
             :pi_cod_docum_banco,
             :po_cod_docum_maestro,
             :po_pass_docum_mastro,
             :po_error
           );
         END;`,
        [
          piCodDocumBanco, // Valor para pi_cod_docum_banco
          { dir: oracledb.BIND_OUT, type: oracledb.STRING }, // po_cod_docum_maestro
          { dir: oracledb.BIND_OUT, type: oracledb.STRING }, // po_pass_docum_mastro
          { dir: oracledb.BIND_OUT, type: oracledb.STRING }, // po_error
        ],
      );


      //await queryRunner.commitTransaction();  // Hace commit de la transacción


      return {
        codDocumMaestro: result[0], // po_cod_docum_maestro
        passDocumMaestro: result[1], // po_pass_docum_mastro
        error: result[2] ?? "", // po_error
      };

    } catch (err) {
      if (queryRunner.isTransactionActive) {  // Verifica si la transacción está activa antes de hacer rollback
        await queryRunner.rollbackTransaction();
      }
      throw err;
    } finally {
      await queryRunner.release();  // Libera el queryRunner al finalizar
    }
  }
}