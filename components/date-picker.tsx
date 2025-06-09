import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DatePickerWrapperProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

export default function DatePickerWrapper({
  date,
  setDate
}: DatePickerWrapperProps) {
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      return;
    }

    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <SafeAreaView>
      <Text onPress={showDatepicker} style={styles.selectedDate}>
        {date.toLocaleDateString()}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  selectedDate: {
    fontSize: 16,
    color: '#1e293b',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  }
})