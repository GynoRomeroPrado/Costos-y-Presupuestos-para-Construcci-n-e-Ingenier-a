import { Module, forwardRef } from '@nestjs/common';
import { ImportService } from './services/import.service';
import { ReportService } from './services/report.service';
import { InsumosModule } from '../insumos/insumos.module';
import { MetradosModule } from '../metrados/metrados.module';

@Module({
  imports: [
    forwardRef(() => InsumosModule),
    forwardRef(() => MetradosModule),
  ],
  providers: [ImportService, ReportService],
  exports: [ImportService, ReportService],
})
export class CommonModule {}
